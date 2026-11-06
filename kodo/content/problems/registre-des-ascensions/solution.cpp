#include <iostream>
#include <algorithm>
using namespace std;

bool est_bissextile(int a) {
    // Divisible par 4, sauf les années divisibles par 100 mais pas par 400.
    return (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
}

int jours_dans_mois(int m, int a) {
    if (m == 2) {
        if (est_bissextile(a)) return 29;
        return 28;
    }
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}

int numero(int j, int m, int a) {
    // Nombre de jours écoulés depuis le 1er janvier 1900.
    int total = 0;
    for (int annee = 1900; annee < a; annee++) {
        if (est_bissextile(annee)) total += 366;
        else total += 365;
    }
    for (int mois = 1; mois < m; mois++) {
        total += jours_dans_mois(mois, a);
    }
    return total + j - 1;
}

int main() {
    int n;
    cin >> n;
    int plus_long = 0;
    int precedent = -1;
    for (int i = 0; i < n; i++) {
        int j, m, a;
        char barre;  // pour lire les « / »
        cin >> j >> barre >> m >> barre >> a;
        int jour = numero(j, m, a);
        if (precedent != -1) {
            plus_long = max(plus_long, jour - precedent);
        }
        precedent = jour;
    }
    cout << plus_long << "\n";
    return 0;
}
