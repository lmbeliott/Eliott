#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    long long n, x, b, c, m;
    cin >> n >> x >> b >> c >> m;
    vector<long long> a(n);
    a[0] = x;
    for (int i = 1; i < n; i++) {
        a[i] = (a[i - 1] * b + c) % m;
    }
    sort(a.begin(), a.end());

    long long paires = 0;
    for (int i = 0; i < n; i++) {
        // premier indice p tel que a[p] >= 2 * a[i]
        long long p = lower_bound(a.begin(), a.end(), 2 * a[i]) - a.begin();
        paires += n - max(p, (long long) i + 1);
    }
    cout << paires << "\n";
    return 0;
}
