#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> p(n);
    for (int i = 0; i < n; i++) cin >> p[i];

    int mini = p[0];              // plus petit prix avant le jour courant
    int meilleur = p[1] - p[0];   // meilleur gain d'une revente avant le jour courant
    for (int j = 1; j < n; j++) {
        // invariant : mini = min(p[0..j-1])
        meilleur = max(meilleur, p[j] - mini);
        mini = min(mini, p[j]);
    }
    cout << meilleur << "\n";
    return 0;
}
