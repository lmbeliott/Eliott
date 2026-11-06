#include <iostream>
using namespace std;

int main() {
    int h, m, d;
    cin >> h >> m >> d;

    // On compte tout en minutes depuis minuit.
    int debut = h * 60 + m;
    int fin = debut + d;

    // On revient aux heures et aux minutes ; l'horloge repart de 0 après 23 h.
    int heures = (fin / 60) % 24;
    int minutes = fin % 60;
    cout << heures << " " << minutes << "\n";
    return 0;
}
