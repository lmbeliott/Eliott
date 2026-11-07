#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

int taille;
vector<long long> arbre;

void ecrire(int pos, long long valeur) {
    pos += taille;
    arbre[pos] = valeur;
    for (pos /= 2; pos >= 1; pos /= 2) arbre[pos] = max(arbre[2 * pos], arbre[2 * pos + 1]);
}

// maximum des cases de rang 0 à r - 1
long long maxPrefixe(int r) {
    long long res = 0;
    for (int g = taille, d = taille + r; g < d; g /= 2, d /= 2) {
        if (g & 1) res = max(res, arbre[g++]);
        if (d & 1) res = max(res, arbre[--d]);
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, d;
    cin >> n >> d;
    vector<long long> a(n), w(n);
    for (auto& x : a) cin >> x;
    for (auto& x : w) cin >> x;

    // Rang de chaque indice quand on trie par (valeur, indice) : les rangs sont tous différents.
    vector<int> ordre(n);
    iota(ordre.begin(), ordre.end(), 0);
    sort(ordre.begin(), ordre.end(), [&](int i, int j) { return a[i] != a[j] ? a[i] < a[j] : i < j; });
    vector<int> rang(n);
    vector<long long> valeursTriees(n);
    for (int r = 0; r < n; r++) {
        rang[ordre[r]] = r;
        valeursTriees[r] = a[ordre[r]];
    }

    // Arbre de segments (maximum) sur les rangs. Une case vaut 0 si l'indice n'est pas dans la fenêtre.
    taille = 1;
    while (taille < n) taille *= 2;
    arbre.assign(2 * taille, 0);

    vector<long long> dp(n);
    long long meilleur = 0;
    for (int i = 0; i < n; i++) {
        if (i - d - 1 >= 0) ecrire(rang[i - d - 1], 0);  // cet indice est trop loin derrière i
        // Les valeurs strictement plus petites que a[i] ont les rangs 0 à limite - 1.
        int limite = lower_bound(valeursTriees.begin(), valeursTriees.end(), a[i]) - valeursTriees.begin();
        dp[i] = w[i] + maxPrefixe(limite);
        ecrire(rang[i], dp[i]);
        meilleur = max(meilleur, dp[i]);
    }
    cout << meilleur << "\n";
    return 0;
}
