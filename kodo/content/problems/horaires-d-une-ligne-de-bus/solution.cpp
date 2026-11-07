#include <iostream>
using namespace std;

int main() {
    int t = 360;  // 6 h 00, en minutes depuis minuit
    for (int i = 0; i < 40; i++) {
        // Heures entières et minutes restantes.
        cout << t / 60 << " " << t % 60 << "\n";
        t = t + 25;
    }
    return 0;
}
