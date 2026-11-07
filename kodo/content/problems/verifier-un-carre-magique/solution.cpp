#include <iostream>
#include <vector>
using namespace std;

// Chaque entier de 1 à n*n apparaît exactement une fois.
bool valeurs_correctes(const vector<vector<int>> &g, int n) {
    vector<bool> vu(n * n + 1, false);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int v = g[i][j];
            if (vu[v]) {
                return false;
            }
            vu[v] = true;
        }
    }
    return true;
}

bool sommes_egales(const vector<vector<int>> &g, int n) {
    int reference = 0;
    for (int j = 0; j < n; j++) {
        reference = reference + g[0][j];
    }
    for (int i = 0; i < n; i++) {   // lignes
        int s = 0;
        for (int j = 0; j < n; j++) {
            s = s + g[i][j];
        }
        if (s != reference) {
            return false;
        }
    }
    for (int j = 0; j < n; j++) {   // colonnes
        int s = 0;
        for (int i = 0; i < n; i++) {
            s = s + g[i][j];
        }
        if (s != reference) {
            return false;
        }
    }
    int d1 = 0, d2 = 0;
    for (int i = 0; i < n; i++) {   // diagonales
        d1 = d1 + g[i][i];
        d2 = d2 + g[i][n - 1 - i];
    }
    return d1 == reference && d2 == reference;
}

int main() {
    int n;
    cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> g[i][j];
        }
    }
    if (valeurs_correctes(g, n) && sommes_egales(g, n)) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
