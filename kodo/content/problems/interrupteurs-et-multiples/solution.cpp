#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> lampe(n + 1, 0);     // lampe[j] : 0 éteinte, 1 allumée (case 0 inutile)
    for (int p = 1; p <= k; p++) {
        for (int j = p; j <= n; j += p) {   // les multiples de p : p, 2p, 3p...
            lampe[j] = 1 - lampe[j];
        }
    }
    int allumees = 0;
    for (int j = 1; j <= n; j++) {
        allumees = allumees + lampe[j];
    }
    cout << allumees << "\n";
    return 0;
}
