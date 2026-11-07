#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    // p[i] = somme des i premiers mouvements, p[0] = 0
    vector<long long> p(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long m;
        cin >> m;
        p[i] = p[i - 1] + m;
    }
    for (int k = 0; k < q; k++) {
        int l, r;
        cin >> l >> r;
        cout << p[r] - p[l - 1] << "\n";
    }
    return 0;
}
