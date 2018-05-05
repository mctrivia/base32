# base32
Simple Math library for encoding json data to small base32 string

base32encode({
  "test": 56,
  "cool": "ma",
  "foo": {
    "bar":6
  }
});
//Z5YKF8VDZUFN2HQVFMKCPAZYKXFUC4KX7VFMMWPBX7UZJZ95JDFUFN3FKZ6

base32decode('Z5YKF8VDZUFN2HQVFMKCPAZYKXFUC4KX7VFMMWPBX7UZJZ95JDFUFN3FKZ6');
//{"test": 56,"cool": "ma","foo": {"bar":6}}
