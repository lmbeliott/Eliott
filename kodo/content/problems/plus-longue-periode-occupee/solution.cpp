#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> creneaux(n);
    for (int i = 0; i < n; i++) {
        cin >> creneaux[i].first >> creneaux[i].second;
    }

    // Trié par heure de début : un créneau ne peut prolonger que la période en cours.
    sort(creneaux.begin(), creneaux.end());

    int nbPeriodes = 0;
    int plusLongue = 0;
    int debut = creneaux[0].first;
    int fin = creneaux[0].second;
    for (int i = 1; i < n; i++) {
        int d = creneaux[i].first;
        int f = creneaux[i].second;
        if (d <= fin) {
            // Le créneau commence avant la fin de la période (ou pile à la fin) :
            // il la prolonge peut-être, mais il peut aussi être entièrement dedans.
            fin = max(fin, f);
        } else {
            // Un trou : la période en cours est terminée.
            nbPeriodes++;
            plusLongue = max(plusLongue, fin - debut);
            debut = d;
            fin = f;
        }
    }

    // La dernière période n'est suivie d'aucun trou.
    nbPeriodes++;
    plusLongue = max(plusLongue, fin - debut);

    cout << nbPeriodes << " " << plusLongue << "\n";
    return 0;
}
