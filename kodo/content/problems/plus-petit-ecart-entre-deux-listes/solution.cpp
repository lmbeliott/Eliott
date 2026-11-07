#include <cstdlib>
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

    int meilleur = abs(a[0] - b[0]);
    int i = 0, j = 0;
    while (i < n && j < m) {
        meilleur = min(meilleur, abs(a[i] - b[j]));
        // la plus petite des deux ne peut pas faire mieux avec les valeurs restantes
        if (a[i] < b[j]) {
            i++;
        } else {
            j++;
        }
    }
    cout << meilleur << "\n";
    return 0;
}
