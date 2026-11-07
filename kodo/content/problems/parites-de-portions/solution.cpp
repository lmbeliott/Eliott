#include <iostream>
#include <map>
#include <vector>
using namespace std;

map<long long, int> numero;  // numéro compact de chaque préfixe rencontré
vector<int> parent;

// chaque préfixe x donne deux sommets : 2k (« P[x] vaut 0 ») et 2k + 1 (« P[x] vaut 1 »)
int sommet(long long x) {
    auto it = numero.find(x);
    if (it != numero.end()) return 2 * it->second;
    int k = numero.size();
    numero[x] = k;
    parent.push_back(2 * k);
    parent.push_back(2 * k + 1);
    return 2 * k;
}

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

void unir(int a, int b) { parent[trouver(a)] = trouver(b); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    int q;
    cin >> n >> q;
    int k = 0;
    for (int t = 0; t < q; t++) {
        long long l, r;
        int p;
        cin >> l >> r >> p;
        // b[l] + ... + b[r] a la parité p  <=>  P[r] et P[l - 1] diffèrent de p
        int i = sommet(l - 1), j = sommet(r);
        if (trouver(i) == trouver(j + 1 - p)) break;  // on sait déjà que la parité est 1 - p
        unir(i, j + p);
        unir(i + 1, j + 1 - p);
        k++;
    }
    cout << k << "\n";
    return 0;
}
