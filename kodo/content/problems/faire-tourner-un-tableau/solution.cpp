#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long k;
    cin >> n >> k;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }

    int d = (int) (((k % n) + n) % n);   // entre 0 et n - 1, même si k est négatif
    vector<int> r(n);
    for (int i = 0; i < n; i++) {
        r[(i + d) % n] = t[i];
    }
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << r[i];
    }
    cout << "\n";
    return 0;
}
