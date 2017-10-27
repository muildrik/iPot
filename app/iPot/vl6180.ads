#include <vl6180_pi/vl6180_pi.h>

vl6180 handle = vl6180_initialise(1);

int distance = get_distance(handle);
