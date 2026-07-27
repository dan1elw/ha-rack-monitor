# PCB

A PCB is a printed circuit board that mechanically supports and electrically connects electronic parts using tiny copper tracks. It acts as the core base for electronics like phones, computers, and toys.

## Schematic

The schematic drawing shows all connections and parts. It serves as a baseline for the later PCB-design. The complete design is done with [easyEDA](https://easyeda.com/).

<div align="center">
    <img src="schematic_rack-monitor.svg" width="70%"/>
</div>

## PCB-Design

By designing the PCB, you place all components on the board and perform the wiring. The board has a size of `120x70mm`. For each part, you first need to define the related footprint.

<div align="center">
    <img src="pcb_rack-monitor.svg" width="70%"/>
</div>

The track sizes are set as follows:

| net | width |
| --- | ----- |
| GND | 2mm |
| 12V | 2mm |
| 5V | 0.8mm |
| 3V3, Data, etc. | 0.3mm |

## final PCB

In the following picture you can see the final PCB (remark: only the top layer is shown). The respecitve gerber-file (zip archive) contains all the related data for production.

<div align="center">
    <img src="board_rack-monitor.svg" width="70%"/>
</div>
