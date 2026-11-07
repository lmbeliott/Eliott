#include <algorithm>
#include <iostream>
#include <utility>
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
            tmp[k++] = t[j++];      // t[j] est plus petit que t[i..milieu[
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
    vector<long long> notes(2 * n);
    notes[0] = x;
    for (int k = 1; k < 2 * n; k++) {
        notes[k] = (notes[k - 1] * b + c) % m;
    }
    vector<pair<long long, long long>> candidats(n);
    for (int i = 0; i < n; i++) {
        candidats[i] = {notes[2 * i], notes[2 * i + 1]};
    }
    sort(candidats.begin(), candidats.end());
    t.resize(n);
    tmp.resize(n);
    for (int i = 0; i < n; i++) {
        t[i] = candidats[i].second;
    }
    cout << triFusion(0, n) << "\n";
    return 0;
}
