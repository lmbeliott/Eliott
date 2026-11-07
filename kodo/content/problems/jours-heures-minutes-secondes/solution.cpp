#include <iostream>
using namespace std;

int main() {
    int s;
    cin >> s;
    // On retire d'abord les jours, puis les heures, puis les minutes.
    int jours = s / 86400;
    int reste = s % 86400;
    int heures = reste / 3600;
    reste = reste % 3600;
    int minutes = reste / 60;
    int secondes = reste % 60;
    cout << jours << " " << heures << " " << minutes << " " << secondes << "\n";
    return 0;
}
