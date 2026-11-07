#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) {
        cin >> x[i];
    }
    sort(x.begin(), x.end());
    long long p = x[(n - 1) / 2];   // la médiane (la plus petite des deux du milieu si n est pair)
    long long total = 0;
    for (long long v : x) {
        total += (v > p ? v - p : p - v);
    }
    cout << p << " " << total << "\n";
    return 0;
}
