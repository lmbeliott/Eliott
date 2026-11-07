#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int plus_longue(const vector<long long> &a, long long m) {
    int n = a.size();
    // sommes préfixes de a[k] - m
    vector<long long> p(n + 1, 0);
    for (int k = 0; k < n; k++) p[k + 1] = p[k] + a[k] - m;
    // L[i] = min(p[0..i]) ; R[j] = max(p[j..n])
    vector<long long> L(n + 1), R(n + 1);
    L[0] = p[0];
    for (int i = 1; i <= n; i++) L[i] = min(L[i - 1], p[i]);
    R[n] = p[n];
    for (int j = n - 1; j >= 0; j--) R[j] = max(R[j + 1], p[j]);
    int meilleur = 0;
    int i = 0, j = 0;
    while (i <= n && j <= n) {
        if (L[i] <= R[j]) {
            meilleur = max(meilleur, j - i);
            j++;
        } else {
            i++;
        }
    }
    return meilleur;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int k = 0; k < q; k++) {
        long long m;
        cin >> m;
        cout << plus_longue(a, m) << "\n";
    }
    return 0;
}
