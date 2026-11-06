#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string carnet;
    cin >> n >> carnet;

    // nombre de constellations différentes du carnet
    vector<bool> presente(26, false);
    int a_voir = 0;
    for (char ch : carnet) {
        if (!presente[ch - 'a']) {
            presente[ch - 'a'] = true;
            a_voir++;
        }
    }

    vector<int> compte(26, 0); // compte[c] = nuits de la fenêtre où l'on voit c
    int vues = 0;              // constellations présentes dans la fenêtre
    int meilleure_duree = n + 1, meilleur_debut = 0;

    int debut = 0;
    for (int fin = 0; fin < n; fin++) {
        int c = carnet[fin] - 'a';
        compte[c]++;
        if (compte[c] == 1) vues++;
        // tant que la fenêtre debut..fin contient tout, on essaie de la raccourcir
        while (vues == a_voir) {
            if (fin - debut + 1 < meilleure_duree) {
                meilleure_duree = fin - debut + 1;
                meilleur_debut = debut;
            }
            int d = carnet[debut] - 'a';
            compte[d]--;
            if (compte[d] == 0) vues--;
            debut++;
        }
    }
    cout << meilleure_duree << " " << meilleur_debut + 1 << "\n";
    return 0;
}
