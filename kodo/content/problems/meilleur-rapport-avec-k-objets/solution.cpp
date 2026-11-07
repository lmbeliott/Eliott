#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;

int n, k;
vector<long long> valeurs, poids;

// existe-t-il K objets avec 1000 * (somme des valeurs) >= q * (somme des poids) ?
// on garde les K objets qui ont le plus grand 1000 * V - q * P
bool possible(long long q) {
    vector<long long> gains(n);
    for (int i = 0; i < n; i++) gains[i] = 1000 * valeurs[i] - q * poids[i];
    sort(gains.begin(), gains.end(), greater<long long>());
    long long somme = 0;
    for (int i = 0; i < k; i++) somme += gains[i];
    return somme >= 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> k;
    valeurs.resize(n);
    poids.resize(n);
    long long plus_grande_valeur = 0;
    for (int i = 0; i < n; i++) {
        cin >> valeurs[i] >> poids[i];
        plus_grande_valeur = max(plus_grande_valeur, valeurs[i]);
    }

    long long possible_ok = 0;                         // q = 0 marche toujours
    long long impossible = 1000 * plus_grande_valeur + 1; // le rapport ne dépasse jamais max(V) / 1
    while (impossible - possible_ok > 1) {
        long long milieu = (possible_ok + impossible) / 2;
        if (possible(milieu)) possible_ok = milieu;
        else impossible = milieu;
    }
    cout << possible_ok << "\n";
    return 0;
}
