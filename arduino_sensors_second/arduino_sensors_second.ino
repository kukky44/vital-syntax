#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <Adafruit_MLX90614.h>

Adafruit_MLX90614 mlx = Adafruit_MLX90614();
MAX30105 particleSensor;

const byte RATE_SIZE = 7; // larger averaging window
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute = 0;
int beatAvg = 0;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  Serial.println("Init...");

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found. Check wiring/power.");
    while (1);
  }

  // indicate running: low red LED (optional)
  particleSensor.setup(); // use default config first

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED


  if (!mlx.begin()) {
    Serial.println("MLX connect fail.");
    while (1);
  }
}

unsigned long lastPrintTime = 0;
const unsigned long PRINT_INTERVAL = 700; // ms

unsigned long lastPresenceTime = 0;
const uint32_t PRESENCE_VAL  = 60000;
const unsigned long RESET_TIMEOUT = 5000;
unsigned long nowMillis = 0;

bool fingerPresent = false;

void loop() {
  // read IR ONCE
  long irValue = particleSensor.getIR();
  nowMillis = millis();

  if(irValue > PRESENCE_VAL) {
    lastPresenceTime = nowMillis;
    fingerPresent = true;
  }

  if (fingerPresent && checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = nowMillis - lastBeat;
    lastBeat = nowMillis;

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }
  
  if (nowMillis - lastPresenceTime > RESET_TIMEOUT) {
    rateSpot = 0;
    lastBeat = 0;
    beatsPerMinute = 0;
    beatAvg = 0;
    memset(rates, 0, sizeof(rates));
    fingerPresent = false;
  }

  // Only print every 100 ms
  if (nowMillis - lastPrintTime >= PRINT_INTERVAL) {
    lastPrintTime = nowMillis;

    Serial.print(irValue);
    Serial.print(",");
    Serial.print(beatAvg);
    Serial.print(",");
    Serial.println(mlx.readObjectTempC());
  }
}
