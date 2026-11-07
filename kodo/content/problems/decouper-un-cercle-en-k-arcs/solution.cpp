#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int n, k;
long long total;
vector<long long> pref;   // sommes préfixes sur le cercle déplié deux fois

// fin (exclue) de l'arc le plus long qui commence en i et pèse au plus d
int suivant(int i, long long d) {
    return int(upper_bound(pref.begin(), pref.end(), pref[i] + d) - pref.begin()) - 1;
}

// nombre d'arcs du découpage glouton qui commence en debut (arrêt après k + 1)
int arcs_depuis(int debut, long long d) {
    int pos = debut, nb = 0;
    while (pos < debut + n && nb <= k) {
        pos = suivant(pos, d);
        nb++;
    }
    return nb;
}

// peut-on couper le cercle en au plus k arcs de poids <= d ? (d >= max(a))
bool possible(long long d) {
    if (d >= total) return true;
    if (arcs_depuis(0, d) <= k) return true;
    // un bon découpage, s'il existe, coupe juste après l'une des cases de l'arc
    // glouton le plus court : on essaie seulement ces débuts-là
    int p = 0;
    for (int i = 1; i < n; i++)
        if (suivant(i, d) - i < suivant(p, d) - p) p = i;
    int fin = suivant(p, d);
    for (int debut = p + 1; debut <= fin; debut++)
        if (arcs_depuis(debut % n, d) <= k) return true;
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> k;
    vector<long long> a(n);
    long long plus_grand = 0;
    total = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        total += a[i];
        plus_grand = max(plus_grand, a[i]);
    }
    pref.assign(2 * n + 1, 0);
    for (int i = 0; i < 2 * n; i++) pref[i + 1] = pref[i] + a[i % n];

    long long moyenne = (total + k - 1) / k;
    long long trop_petit = max(plus_grand, moyenne) - 1;   // aucun découpage ne fait mieux
    long long suffisant = moyenne + plus_grand;             // le glouton depuis la case 1 y arrive
    while (suffisant - trop_petit > 1) {
        long long milieu = (trop_petit + suffisant) / 2;
        if (possible(milieu)) suffisant = milieu;
        else trop_petit = milieu;
    }
    cout << suffisant << "\n";
    return 0;
}
