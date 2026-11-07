#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<long long> t, tmp;

// trie t[debut..fin[ et renvoie son nombre d'inversions
long long triFusion(int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int milieu = (debut + fin) / 2;
    long long inv = triFusion(debut, milieu) + triFusion(milieu, fin);
    int i = debut, j = milieu, k = debut;
    while (i < milieu && j < fin) {
        if (t[i] <= t[j]) {
            tmp[k++] = t[i++];
        } else {
            tmp[k++] = t[j++];
            inv += milieu - i;
        }
    }
    while (i < milieu) tmp[k++] = t[i++];
    while (j < fin) tmp[k++] = t[j++];
    for (int p = debut; p < fin; p++) {
        t[p] = tmp[p];
    }
    return inv;
}

int main() {
    long long n, x, b, c, m;
    cin >> n >> x >> b >> c >> m;
    vector<long long> a(n);
    a[0] = x;
    for (int i = 1; i < n; i++) {
        a[i] = (a[i - 1] * b + c) % m;
    }
    t = a;
    tmp.resize(n);
    long long inv = triFusion(0, n);      // t est maintenant trié
    long long meilleur = inv;
    for (int k = 0; k < n - 1; k++) {
        // a[k] passe de la tête à la fin
        long long plusPetits = lower_bound(t.begin(), t.end(), a[k]) - t.begin();
        long long plusGrands = t.end() - upper_bound(t.begin(), t.end(), a[k]);
        inv = inv - plusPetits + plusGrands;
        meilleur = min(meilleur, inv);
    }
    cout << meilleur << "\n";
    return 0;
}
