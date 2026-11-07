#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    cin >> m;
    vector<int> b(m);
    for (int j = 0; j < m; j++) cin >> b[j];

    vector<int> resultat;
    int i = 0, j = 0;
    while (i < n || j < m) {
        // la plus petite valeur restante est a[i] ou b[j]
        int x;
        if (j == m || (i < n && a[i] <= b[j])) {
            x = a[i];
            i++;
        } else {
            x = b[j];
            j++;
        }
        if (resultat.empty() || resultat.back() != x) {   // les copies sont consécutives
            resultat.push_back(x);
        }
    }

    cout << resultat.size() << "\n";
    for (int k = 0; k < (int) resultat.size(); k++) {
        if (k > 0) cout << " ";
        cout << resultat[k];
    }
    cout << "\n";
    return 0;
}
