#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long budget;
    cin >> n >> budget;
    string prix;   // les prix sont des chiffres collés
    cin >> prix;

    int meilleur = 0;
    int debut = 0;       // la fenêtre contient les jours debut..fin
    long long total = 0; // prix total des jours de la fenêtre
    for (int fin = 0; fin < n; fin++) {
        total += prix[fin] - '0';
        // trop cher : on retire des jours au début
        while (total > budget) {
            total -= prix[debut] - '0';
            debut++;
        }
        meilleur = max(meilleur, fin - debut + 1);
    }
    cout << meilleur << "\n";
    return 0;
}
