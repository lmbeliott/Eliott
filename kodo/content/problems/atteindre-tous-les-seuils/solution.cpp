#include <iostream>
#include <vector>
using namespace std;

int n, m;
vector<long long> seuils;
vector<int> gauche, droite, valeur;

// les k premiers ajouts suffisent-ils ? (tableau de différences)
bool suffisant(int k) {
    vector<long long> diff(n + 1, 0);
    for (int i = 0; i < k; i++) {
        diff[gauche[i]] += valeur[i];
        diff[droite[i]] -= valeur[i];
    }
    long long courant = 0;
    for (int i = 0; i < n; i++) {
        courant += diff[i];
        if (courant < seuils[i]) return false;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n >> m;
    seuils.resize(n);
    for (int i = 0; i < n; i++) cin >> seuils[i];
    gauche.resize(m);
    droite.resize(m);
    valeur.resize(m);
    for (int i = 0; i < m; i++) {
        int l, r;
        cin >> l >> r >> valeur[i];
        gauche[i] = l - 1;   // cases numérotées à partir de 0, fin exclue
        droite[i] = r;
    }

    if (!suffisant(m)) {
        cout << -1 << "\n";
        return 0;
    }
    int pas_assez = 0;   // 0 ajout ne suffit jamais : les seuils sont au moins 1
    int assez = m;
    while (assez - pas_assez > 1) {
        int milieu = (pas_assez + assez) / 2;
        if (suffisant(milieu)) assez = milieu;
        else pas_assez = milieu;
    }
    cout << assez << "\n";
    return 0;
}
