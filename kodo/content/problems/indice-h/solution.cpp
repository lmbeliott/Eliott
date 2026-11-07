#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    // tri par comptage des valeurs plafonnées à n
    vector<int> cpt(n + 1, 0);
    for (int i = 0; i < n; i++) {
        long long v;
        cin >> v;
        cpt[min(v, (long long)n)]++;
    }
    int au_moins = 0;     // nombre d'articles cités au moins h fois
    for (int h = n; h >= 0; h--) {
        au_moins += cpt[h];
        if (au_moins >= h) {
            cout << h << "\n";
            break;
        }
    }
    return 0;
}
