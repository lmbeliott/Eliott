#include <iostream>
#include <vector>
using namespace std;

vector<long long> t, tmp;

// trie t[debut..fin[ et renvoie le nombre de paires i < j avec t[i] > 2 t[j]
long long compte(int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int milieu = (debut + fin) / 2;
    long long total = compte(debut, milieu) + compte(milieu, fin);
    // paires à cheval : pour chaque y à droite, les x à gauche tels que x > 2y
    int i = debut;
    for (int j = milieu; j < fin; j++) {
        while (i < milieu && t[i] <= 2 * t[j]) {
            i++;
        }
        total += milieu - i;
    }
    // fusion habituelle
    i = debut;
    int j = milieu, k = debut;
    while (i < milieu && j < fin) {
        if (t[i] <= t[j]) {
            tmp[k++] = t[i++];
        } else {
            tmp[k++] = t[j++];
        }
    }
    while (i < milieu) tmp[k++] = t[i++];
    while (j < fin) tmp[k++] = t[j++];
    for (int p = debut; p < fin; p++) {
        t[p] = tmp[p];
    }
    return total;
}

int main() {
    long long n, x, b, c, m;
    cin >> n >> x >> b >> c >> m;
    t.resize(n);
    tmp.resize(n);
    t[0] = x;
    for (int i = 1; i < n; i++) {
        t[i] = (t[i - 1] * b + c) % m;
    }
    cout << compte(0, n) << "\n";
    return 0;
}
