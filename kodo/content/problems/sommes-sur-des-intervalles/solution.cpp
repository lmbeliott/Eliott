#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    string chiffres;
    cin >> chiffres;

    // cumul[i] = somme des i premières valeurs
    vector<int> cumul(n + 1, 0);
    for (int i = 0; i < n; i++) cumul[i + 1] = cumul[i] + (chiffres[i] - '0');

    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        // jours A à B = (B premiers jours) - (A - 1 premiers jours)
        cout << cumul[b] - cumul[a - 1] << "\n";
    }
    return 0;
}
