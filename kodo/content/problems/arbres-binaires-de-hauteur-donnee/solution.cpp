#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007;
vector<vector<long long>> memo;   // -1 : pas encore calculé

// nombre d'arbres binaires à nb nœuds de hauteur au plus haut (l'arbre vide a pour hauteur -1)
long long au_plus(int nb, int haut) {
    if (nb == 0) return 1;
    if (haut < 0) return 0;
    if (memo[nb][haut] != -1) return memo[nb][haut];
    long long total = 0;
    for (int g = 0; g < nb; g++)      // g nœuds à gauche, nb - 1 - g à droite
        total = (total + au_plus(g, haut - 1) * au_plus(nb - 1 - g, haut - 1)) % MOD;
    memo[nb][haut] = total;
    return total;
}

int main() {
    int n, h;
    cin >> n >> h;
    memo.assign(n + 1, vector<long long>(n + 1, -1));
    cout << ((au_plus(n, h) - au_plus(n, h - 1)) % MOD + MOD) % MOD << "\n";
    return 0;
}
