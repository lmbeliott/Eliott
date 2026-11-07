#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];

    int v = *max_element(t.begin(), t.end());
    vector<long long> f(v + 1, 0);   // f[x] : nombre de positions de valeur x
    for (int x : t) {
        f[x]++;
    }

    long long total = 0;
    for (int d = 1; d <= v; d++) {
        if (f[d] > 0) {
            // positions dont la valeur est un multiple de d
            long long s = 0;
            for (int m = d; m <= v; m += d) {
                s += f[m];
            }
            total += f[d] * s;
        }
    }
    cout << total - n << "\n";   // retirer les couples (i, i)
    return 0;
}
