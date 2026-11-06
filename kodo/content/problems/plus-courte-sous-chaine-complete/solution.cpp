#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string chaine;
    cin >> n >> chaine;

    // nombre de lettres différentes de la chaîne
    vector<bool> presente(26, false);
    int a_voir = 0;
    for (char ch : chaine) {
        if (!presente[ch - 'a']) {
            presente[ch - 'a'] = true;
            a_voir++;
        }
    }

    vector<int> compte(26, 0); // compte[c] = nombre de lettres c dans la fenêtre
    int vues = 0;              // lettres différentes présentes dans la fenêtre
    int meilleure_longueur = n + 1, meilleur_debut = 0;

    int debut = 0;
    for (int fin = 0; fin < n; fin++) {
        int c = chaine[fin] - 'a';
        compte[c]++;
        if (compte[c] == 1) vues++;
        // tant que la fenêtre debut..fin contient tout, on essaie de la raccourcir
        while (vues == a_voir) {
            if (fin - debut + 1 < meilleure_longueur) {
                meilleure_longueur = fin - debut + 1;
                meilleur_debut = debut;
            }
            int d = chaine[debut] - 'a';
            compte[d]--;
            if (compte[d] == 0) vues--;
            debut++;
        }
    }
    cout << meilleure_longueur << " " << meilleur_debut + 1 << "\n";
    return 0;
}
