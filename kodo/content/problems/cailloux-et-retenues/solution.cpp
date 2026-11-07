#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> c(n);
    for (int i = 0; i < n; i++) cin >> c[i];

    long long operations = 0;
    for (int i = 0; i + 1 < n; i++) {
        long long q = c[i] / 2;   // toutes les opérations possibles dans la boîte i, d'un coup
        operations += q;
        c[i] -= 2 * q;
        c[i + 1] += q;
    }
    cout << operations << "\n";
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << c[i];
    }
    cout << "\n";
    return 0;
}
