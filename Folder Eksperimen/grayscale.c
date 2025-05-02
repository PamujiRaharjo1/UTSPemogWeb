// file: grayscale.c
#include <stdint.h>
#include <stdlib.h>

void grayscale(uint8_t *imageData, int length) {
    for (int i = 0; i < length; i += 4) {
        uint8_t r = imageData[i];
        uint8_t g = imageData[i + 1];
        uint8_t b = imageData[i + 2];
        uint8_t gray = (r + g + b) / 3;
        imageData[i] = gray;
        imageData[i + 1] = gray;
        imageData[i + 2] = gray;
    }
}
