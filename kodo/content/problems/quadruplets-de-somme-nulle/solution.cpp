#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<vector<long long>> l(4, vector<long long>(n));
    for (int k = 0; k < 4; k++) {
        for (int i = 0; i < n; i++) {
            cin >> l[k][i];
        }
    }

    // nombre de façons d'obtenir chaque somme a[i] + b[j]
    unordered_map<long long, long long> sommes_ab;
    for (long long x : l[0]) {
        for (long long y : l[1]) {
            sommes_ab[x + y]++;
        }
    }

    // pour chaque c[k] + d[l], il faut a[i] + b[j] = -(c[k] + d[l])
    long long total = 0;
    for (long long z : l[2]) {
        for (long long t : l[3]) {
            if (sommes_ab.count(-(z + t)) > 0) {
                total = total + sommes_ab[-(z + t)];
            }
        }
    }
    cout << total << "\n";
    return 0;
}
