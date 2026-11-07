#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];

    // gauche[i] : plus haute colonne parmi 0..i ; droite[i] : parmi i..n-1
    vector<int> gauche(n), droite(n);
    gauche[0] = h[0];
    for (int i = 1; i < n; i++) {
        gauche[i] = max(gauche[i - 1], h[i]);
    }
    droite[n - 1] = h[n - 1];
    for (int i = n - 2; i >= 0; i--) {
        droite[i] = max(droite[i + 1], h[i]);
    }

    long long eau = 0;
    for (int i = 0; i < n; i++) {
        eau += min(gauche[i], droite[i]) - h[i];
    }
    cout << eau << "\n";
    return 0;
}
