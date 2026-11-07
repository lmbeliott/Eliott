#include <iostream>
#include <vector>
using namespace std;

vector<long long> p, tmp;
long long L, R;

// trie p[debut..fin[ et renvoie le nombre de paires i < j avec L <= p[j] - p[i] <= R
long long compte(int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int milieu = (debut + fin) / 2;
    long long total = compte(debut, milieu) + compte(milieu, fin);
    // paires à cheval : pour v à gauche, les w à droite dans [v + L, v + R]
    int bas = milieu, haut = milieu;
    for (int i = debut; i < milieu; i++) {
        while (bas < fin && p[bas] < p[i] + L) bas++;
        while (haut < fin && p[haut] <= p[i] + R) haut++;
        total += haut - bas;
    }
    // fusion
    int i = debut, j = milieu, k = debut;
    while (i < milieu && j < fin) {
        if (p[i] <= p[j]) {
            tmp[k++] = p[i++];
        } else {
            tmp[k++] = p[j++];
        }
    }
    while (i < milieu) tmp[k++] = p[i++];
    while (j < fin) tmp[k++] = p[j++];
    for (int q = debut; q < fin; q++) {
        p[q] = tmp[q];
    }
    return total;
}

int main() {
    long long n, x, b, c, m, d;
    cin >> n >> L >> R >> x >> b >> c >> m >> d;
    p.assign(n + 1, 0);
    tmp.resize(n + 1);
    long long u = x;
    for (int k = 0; k < n; k++) {
        p[k + 1] = p[k] + u - d;
        u = (u * b + c) % m;
    }
    cout << compte(0, n + 1) << "\n";
    return 0;
}
