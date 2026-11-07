#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long s, x, b, c, m;
    cin >> n >> s >> x >> b >> c >> m;
    vector<long long> a(n);
    a[0] = x;
    for (int i = 1; i < n; i++) {
        a[i] = (a[i - 1] * b + c) % m;
    }
    sort(a.begin(), a.end());

    long long paires = 0;
    int g = 0, d = n - 1;
    while (g < d) {
        if (a[g] + a[d] <= s) {
            paires += d - g;   // a[g] avec a[g+1], ..., a[d]
            g++;
        } else {
            d--;               // a[d] ne forme plus aucune paire
        }
    }
    cout << paires << "\n";
    return 0;
}
