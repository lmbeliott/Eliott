#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    // g[i] : position la plus proche à gauche avec une valeur <= a[i] (ou -1)
    vector<int> g(n), d(n), pile;
    for (int i = 0; i < n; i++) {
        while (!pile.empty() && a[pile.back()] > a[i]) {
            pile.pop_back();
        }
        g[i] = pile.empty() ? -1 : pile.back();
        pile.push_back(i);
    }
    // d[i] : position la plus proche à droite avec une valeur < a[i] (ou n)
    pile.clear();
    for (int i = n - 1; i >= 0; i--) {
        while (!pile.empty() && a[pile.back()] >= a[i]) {
            pile.pop_back();
        }
        d[i] = pile.empty() ? n : pile.back();
        pile.push_back(i);
    }
    long long total = 0;
    for (int i = 0; i < n; i++) {
        // a[i] est le minimum (le plus à gauche) de (i - g[i]) * (d[i] - i) portions
        total += a[i] * (i - g[i]) * (d[i] - i);
    }
    cout << total << "\n";
    return 0;
}
