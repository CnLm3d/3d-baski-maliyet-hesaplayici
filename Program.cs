using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace CostCalculator3D
{
    static class Program
    {
        private static HttpListener listener;
        private static string appDir;
        private static int port;
        private static bool isRunning = true;
        private static NotifyIcon trayIcon;
        private static ContextMenuStrip trayMenu;
        private static string appUrl;

        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            appDir = AppDomain.CurrentDomain.BaseDirectory;

            // Masaüstü kısayolu oluşturma argümanı kontrolü
            if (args != null && args.Length > 0 && args[0].ToLowerInvariant() == "--create-shortcut")
            {
                CreateDesktopShortcut();
                MessageBox.Show("Masaüstüne kısayol başarıyla oluşturuldu!", "Bilgi", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            // Sabit güvenli port aralığı veya boş port bul
            port = FindFreePort();
            appUrl = "http://127.0.0.1:" + port + "/";

            // HTTP Sunucusunu başlat (Yalnızca 127.0.0.1 - UAC izni gerektirmez)
            try
            {
                listener = new HttpListener();
                listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
                listener.Start();

                Thread serverThread = new Thread(ServerLoop);
                serverThread.IsBackground = true;
                serverThread.Start();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Yerel web sunucusu başlatılamadı: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Sistem Tepsisi (Tray Icon) Oluştur
            InitializeTrayIcon();

            // Tarayıcı penceresini aç
            LaunchAppWindow(appUrl);

            // Uygulamayı mesaj döngüsüyle arka planda canlı tut (ASLA KAPANMAZ)
            Application.Run();

            // Uygulama kapanırken temizle
            isRunning = false;
            try
            {
                if (trayIcon != null)
                {
                    trayIcon.Visible = false;
                    trayIcon.Dispose();
                }
                if (listener != null)
                {
                    listener.Stop();
                    listener.Close();
                }
            }
            catch { }
        }

        private static void InitializeTrayIcon()
        {
            trayMenu = new ContextMenuStrip();
            
            ToolStripMenuItem itemOpen = new ToolStripMenuItem("Uygulama Penceresini Aç", null, (s, e) => LaunchAppWindow(appUrl));
            itemOpen.Font = new Font(itemOpen.Font, FontStyle.Bold);
            trayMenu.Items.Add(itemOpen);

            trayMenu.Items.Add(new ToolStripSeparator());

            ToolStripMenuItem itemBrowser = new ToolStripMenuItem("Varsayılan Tarayıcıda Aç", null, (s, e) => {
                try { Process.Start(new ProcessStartInfo(appUrl) { UseShellExecute = true }); } catch { }
            });
            trayMenu.Items.Add(itemBrowser);

            ToolStripMenuItem itemFolder = new ToolStripMenuItem("Uygulama Klasörünü Aç", null, (s, e) => {
                try { Process.Start(new ProcessStartInfo("explorer.exe", appDir)); } catch { }
            });
            trayMenu.Items.Add(itemFolder);

            trayMenu.Items.Add(new ToolStripSeparator());

            ToolStripMenuItem itemExit = new ToolStripMenuItem("Çıkış (Kapat)", null, (s, e) => {
                Application.Exit();
            });
            trayMenu.Items.Add(itemExit);

            trayIcon = new NotifyIcon
            {
                Text = "3D Baskı Maliyet ve Teklif Robotu (Çalışıyor)",
                ContextMenuStrip = trayMenu,
                Visible = true
            };

            try
            {
                string iconPath = Path.Combine(appDir, "app.ico");
                if (File.Exists(iconPath))
                {
                    trayIcon.Icon = new Icon(iconPath);
                }
                else
                {
                    trayIcon.Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
                }
            }
            catch
            {
                trayIcon.Icon = SystemIcons.Application;
            }

            trayIcon.DoubleClick += (s, e) => LaunchAppWindow(appUrl);
        }

        private static int FindFreePort()
        {
            try
            {
                // Önce standart 18942 portunu dene, olmazsa dinamik al
                TcpListener test = new TcpListener(IPAddress.Loopback, 18942);
                test.Start();
                test.Stop();
                return 18942;
            }
            catch
            {
                TcpListener l = new TcpListener(IPAddress.Loopback, 0);
                l.Start();
                int p = ((IPEndPoint)l.LocalEndpoint).Port;
                l.Stop();
                return p;
            }
        }

        private static void LaunchAppWindow(string url)
        {
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            if (!File.Exists(edgePath))
            {
                edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
            }

            string chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
            if (!File.Exists(chromePath))
            {
                chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");
            }

            string targetBrowser = null;
            if (File.Exists(edgePath)) targetBrowser = edgePath;
            else if (File.Exists(chromePath)) targetBrowser = chromePath;

            string userDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "3D_Maliyet_Hesaplayici_Data");

            ProcessStartInfo psi = new ProcessStartInfo();
            if (targetBrowser != null)
            {
                psi.FileName = targetBrowser;
                psi.Arguments = string.Format("--app=\"{0}\" --window-size=1400,900 --user-data-dir=\"{1}\" --enable-features=OverlayScrollbar", url, userDataDir);
                psi.UseShellExecute = false;
            }
            else
            {
                psi.FileName = url;
                psi.UseShellExecute = true;
            }

            try
            {
                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Uygulama penceresi açılamadı: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static void CreateDesktopShortcut()
        {
            try
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string exePath = Application.ExecutablePath;
                string shortcutPath = Path.Combine(desktopPath, "3D Baski Maliyet Hesaplayici.url");

                using (StreamWriter writer = new StreamWriter(shortcutPath))
                {
                    writer.WriteLine("[InternetShortcut]");
                    writer.WriteLine("URL=file:///" + exePath.Replace('\\', '/'));
                    writer.WriteLine("IconIndex=0");
                    writer.WriteLine("IconFile=" + exePath);
                }
            }
            catch { }
        }

        private static void ServerLoop()
        {
            while (isRunning && listener != null && listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = listener.GetContext();
                    ThreadPool.QueueUserWorkItem((c) => ProcessRequest((HttpListenerContext)c), context);
                }
                catch
                {
                    if (!isRunning) break;
                }
            }
        }

        private static void ProcessRequest(HttpListenerContext context)
        {
            try
            {
                string rawUrl = context.Request.Url.AbsolutePath;
                if (rawUrl == "/" || string.IsNullOrEmpty(rawUrl))
                {
                    rawUrl = "/index.html";
                }

                // Heartbeat API
                if (rawUrl == "/api/heartbeat")
                {
                    byte[] okBytes = Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.OutputStream.Write(okBytes, 0, okBytes.Length);
                    context.Response.Close();
                    return;
                }

                string relativePath = rawUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                string filePath = Path.Combine(appDir, relativePath);

                if (!File.Exists(filePath))
                {
                    context.Response.StatusCode = 404;
                    byte[] notFoundBytes = Encoding.UTF8.GetBytes("404 - Dosya Bulunamadı: " + relativePath);
                    context.Response.ContentType = "text/plain; charset=utf-8";
                    context.Response.OutputStream.Write(notFoundBytes, 0, notFoundBytes.Length);
                    context.Response.Close();
                    return;
                }

                string ext = Path.GetExtension(filePath).ToLowerInvariant();
                string contentType = "application/octet-stream";
                switch (ext)
                {
                    case ".html":
                    case ".htm":
                        contentType = "text/html; charset=utf-8";
                        break;
                    case ".js":
                        contentType = "application/javascript; charset=utf-8";
                        break;
                    case ".css":
                        contentType = "text/css; charset=utf-8";
                        break;
                    case ".json":
                        contentType = "application/json; charset=utf-8";
                        break;
                    case ".png":
                        contentType = "image/png";
                        break;
                    case ".jpg":
                    case ".jpeg":
                        contentType = "image/jpeg";
                        break;
                    case ".svg":
                        contentType = "image/svg+xml";
                        break;
                    case ".ico":
                        contentType = "image/x-icon";
                        break;
                    case ".stl":
                    case ".3mf":
                    case ".gcode":
                        contentType = "application/octet-stream";
                        break;
                }

                byte[] fileBytes = File.ReadAllBytes(filePath);
                context.Response.ContentType = contentType;
                context.Response.ContentLength64 = fileBytes.Length;
                context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                context.Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                context.Response.OutputStream.Write(fileBytes, 0, fileBytes.Length);
                context.Response.Close();
            }
            catch
            {
                try { context.Response.Close(); } catch { }
            }
        }
    }
}
