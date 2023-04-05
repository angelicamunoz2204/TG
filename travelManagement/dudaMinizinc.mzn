include "globals.mzn";
array [1..67] of int: departureSegmentsDuration = [52,222,599,170,695,53,58,203,53,268,53,468,229,274,240,239,183,181,402,337,214,549,52,52,329,218,770,438,213,183,
373,1131,253,196,181,52,228,213,949,197,320,459,219,264,295,195,58,53,169,213,396,412,53,474,209,477,298,241,202,987,
254,208,203,215,215,844,205];

var 1..67:posDeparture;
%la siguiente restriccion se pone como <= 51, porque en el arreglo departureSegmentsDuration el numero menor es 52, entonces con cualquier numero <52 el problema es insatisfactible
%cuando se pone un numero 52>= encuentra la solucion correctamente
constraint departureSegmentsDuration[posDeparture] <= 51;

output[show(posDeparture),"\n"];

