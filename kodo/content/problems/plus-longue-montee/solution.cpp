#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // La première mesure forme à elle seule une montée de longueur 1.
    int precedente;
    cin >> precedente;
    int enCours = 1;
    int meilleure = 1;

    for (int i = 0; i < n - 1; i++) {
        int mesure;
        cin >> mesure;
        if (mesure > precedente) {
            enCours = enCours + 1;  // la montée continue
        } else {
            enCours = 1;            // une nouvelle montée commence
        }
        if (enCours > meilleure) {
            meilleure = enCours;
        }
        precedente = mesure;
    }

    cout << meilleure << "\n";
    return 0;
}
