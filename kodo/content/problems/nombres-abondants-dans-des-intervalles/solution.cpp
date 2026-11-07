#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    vector<int> L(q), R(q);
    int n = 1;
    for (int i = 0; i < q; i++) {
        cin >> L[i] >> R[i];
        n = max(n, R[i]);
    }

    // s[m] = somme des diviseurs de m strictement plus petits que m
    vector<long long> s(n + 1, 0);
    for (int d = 1; d <= n / 2; d++) {
        for (int m = 2 * d; m <= n; m += d) {
            s[m] += d;
        }
    }

    // c[m] = nombre d'abondants entre 1 et m
    vector<int> c(n + 1, 0);
    for (int m = 1; m <= n; m++) {
        c[m] = c[m - 1] + (s[m] > m ? 1 : 0);
    }

    for (int i = 0; i < q; i++) {
        cout << c[R[i]] - c[L[i] - 1] << "\n";
    }
    return 0;
}
