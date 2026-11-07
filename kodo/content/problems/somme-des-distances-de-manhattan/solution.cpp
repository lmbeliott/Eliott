#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// somme des |v[i] - v[j]| sur toutes les paires i < j
long long somme_ecarts(vector<long long> v) {
    sort(v.begin(), v.end());
    long long total = 0;
    long long prefixe = 0;     // v[0] + ... + v[k-1]
    for (int k = 0; k < (int)v.size(); k++) {
        total += k * v[k] - prefixe;
        prefixe += v[k];
    }
    return total;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> xs(n), ys(n);
    for (int i = 0; i < n; i++) {
        cin >> xs[i] >> ys[i];
    }
    cout << somme_ecarts(xs) + somme_ecarts(ys) << "\n";
    return 0;
}
