; GENERATED_BY: BambuStudio 01.09.02.57
; total filament used [g] = 52.4
; filament used [g] = 52.4
; filament used [mm] = 17583.9
; estimated printing time (normal mode) = 3h 15m 30s
; total estimated time : 3h 15m
; TIME:11730
; layer_height = 0.20
; initial_layer_print_height = 0.20
; nozzle_diameter = 0.40
; printer_model = Bambu Lab X1-Carbon
; filament_type = PLA
; filament_colour = #FF0000;#FFFFFF

; GCODE START
M104 S220 ; set nozzle temp
M140 S60 ; set bed temp
G28 ; home all axes
G90 ; use absolute coordinates

; LAYER:0
G1 Z0.200 F1200
T0
; COLOR_CHANGE
G1 X10.0 Y10.0 F6000
G1 X60.0 Y10.0 E1.5 F1800
G1 X60.0 Y60.0 E3.0 F1800
G1 X10.0 Y60.0 E4.5 F1800
G1 X10.0 Y10.0 E6.0 F1800

; LAYER:1
G1 Z0.400 F1200
T1
; COLOR_CHANGE
G1 X15.0 Y15.0 F6000
G1 X55.0 Y15.0 E7.2 F1800
G1 X55.0 Y55.0 E8.4 F1800
G1 X15.0 Y55.0 E9.6 F1800
G1 X15.0 Y15.0 E10.8 F1800

; LAYER:2
G1 Z0.600 F1200
T0
; COLOR_CHANGE
G1 X20.0 Y20.0 F6000
G1 X50.0 Y20.0 E12.0 F1800
G1 X50.0 Y50.0 E13.2 F1800
G1 X20.0 Y50.0 E14.4 F1800
G1 X20.0 Y20.0 E15.6 F1800

; LAYER:150 (Z=30mm)
G1 Z30.000 F1200
T1
; COLOR_CHANGE
G1 X30.0 Y30.0 F6000
G1 X40.0 Y30.0 E16.8 F1800
G1 X40.0 Y40.0 E18.0 F1800
G1 X30.0 Y40.0 E19.2 F1800
G1 X30.0 Y30.0 E20.4 F1800

; END GCODE
M104 S0 ; turn off nozzle
M140 S0 ; turn off bed
M84 ; disable motors
; total filament used [g] = 52.4
; total estimated time : 3h 15m
