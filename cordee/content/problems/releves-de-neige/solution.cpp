#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    string releves;
    cin >> releves;

    // cumul[i] = neige tombée pendant les i premières nuits
    vector<int> cumul(n + 1, 0);
    for (int i = 0; i < n; i++) cumul[i + 1] = cumul[i] + (releves[i] - '0');

    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        cout << cumul[b] - cumul[a - 1] << "\n";
    }
    return 0;
}
