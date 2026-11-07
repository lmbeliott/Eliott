#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long c, x, a, b;
    cin >> n >> c >> x >> a >> b;
    vector<long long> p(n);
    p[0] = x;
    for (int i = 1; i < n; i++) {
        p[i] = (p[i - 1] * a + b) % c;
    }
    sort(p.begin(), p.end());

    // écarts entre voisins, puis écart de bouclage par la ligne de départ
    vector<long long> ecarts;
    bool egalite = false;
    for (int i = 0; i + 1 < n; i++) {
        ecarts.push_back(p[i + 1] - p[i]);
        if (p[i + 1] == p[i]) egalite = true;
    }
    ecarts.push_back(c - (p[n - 1] - p[0]));

    if (egalite) {
        // des coureurs à la même position : on compte les paires dans chaque bloc
        long long paires = 0;
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && p[j] == p[i]) j++;
            long long k = j - i;
            paires += k * (k - 1) / 2;
            i = j;
        }
        cout << 0 << " " << paires << "\n";
    } else if (n == 2) {
        cout << min(ecarts[0], c - ecarts[0]) << " " << 1 << "\n";
    } else {
        long long d = ecarts[0];
        for (long long e : ecarts) d = min(d, e);
        long long nb = 0;                // nombre d'écarts égaux à d
        for (long long e : ecarts) {
            if (e == d) nb++;
        }
        cout << d << " " << nb << "\n";
    }
    return 0;
}
