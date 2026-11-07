#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long c;
    cin >> n >> c;
    vector<long long> p(n);
    for (int i = 0; i < n; i++) {
        cin >> p[i];
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
        long long d = *min_element(ecarts.begin(), ecarts.end());
        cout << d << " " << count(ecarts.begin(), ecarts.end(), d) << "\n";
    }
    return 0;
}
