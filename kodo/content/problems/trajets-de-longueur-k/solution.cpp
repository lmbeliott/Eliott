#include <iostream>
#include <vector>
using namespace std;

// Nouvelle grille z avec z[i][j] = somme des x[i][p] * y[p][j].
vector<vector<long long>> produit(const vector<vector<long long>> &x, const vector<vector<long long>> &y) {
    int n = x.size();
    vector<vector<long long>> z(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            long long s = 0;
            for (int p = 0; p < n; p++) {
                s = s + x[i][p] * y[p][j];
            }
            z[i][j] = s;
        }
    }
    return z;
}

int main() {
    int n, k;
    cin >> n >> k;
    vector<vector<long long>> a(n, vector<long long>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }

    vector<vector<long long>> c = a;                   // trajets de longueur 1
    for (int etape = 0; etape < k - 1; etape++) {
        c = produit(c, a);          // on allonge les trajets d'une route
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (j > 0) {
                cout << " ";
            }
            cout << c[i][j];
        }
        cout << "\n";
    }
    return 0;
}
