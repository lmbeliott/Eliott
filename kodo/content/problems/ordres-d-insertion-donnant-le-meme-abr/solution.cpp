#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007;

long long puissance(long long a, long long e) {
    long long r = 1;
    a %= MOD;
    while (e > 0) {
        if (e & 1) r = r * a % MOD;
        a = a * a % MOD;
        e >>= 1;
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    vector<int> ordre(n);
    for (int i = 0; i < n; i++) cin >> ordre[i];
    // construction de l'arbre binaire de recherche par insertions successives
    vector<int> gauche(n + 1, 0), droite(n + 1, 0);
    int racine = ordre[0];
    for (int i = 1; i < n; i++) {
        int x = ordre[i], v = racine;
        while (true) {
            if (x < v) {
                if (gauche[v] == 0) { gauche[v] = x; break; }
                v = gauche[v];
            } else {
                if (droite[v] == 0) { droite[v] = x; break; }
                v = droite[v];
            }
        }
    }
    // factorielles et inverses modulo MOD (petit théorème de Fermat)
    vector<long long> fact(n + 1, 1), inv_fact(n + 1, 1);
    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;
    inv_fact[n] = puissance(fact[n], MOD - 2);
    for (int i = n; i > 0; i--) inv_fact[i - 1] = inv_fact[i] * i % MOD;
    auto binomial = [&](int a, int b) { return fact[a] * inv_fact[b] % MOD * inv_fact[a - b] % MOD; };
    // les descendants d'un nœud sont insérés après lui :
    // en parcourant l'ordre à l'envers, les fils sont traités avant leur père
    vector<int> taille(n + 1, 0);
    vector<long long> facons(n + 1, 1);              // facons[0] = 1 pour l'arbre vide
    for (int i = n - 1; i >= 0; i--) {
        int v = ordre[i], g = gauche[v], d = droite[v];
        taille[v] = taille[g] + taille[d] + 1;
        facons[v] = binomial(taille[g] + taille[d], taille[g]) * facons[g] % MOD * facons[d] % MOD;
    }
    cout << facons[racine] << "\n";
    return 0;
}
