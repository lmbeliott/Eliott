#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n + 1), pos(n + 1);   // positions numérotées de 1 à n
    for (int p = 1; p <= n; p++) {
        cin >> a[p];
        pos[a[p]] = p;                  // pos[v] = position actuelle de la valeur v
    }
    int echanges = 0;
    for (int i = 1; i <= n; i++) {
        // invariant : les positions 1 à i-1 contiennent déjà 1 à i-1
        if (a[i] != i) {
            int j = pos[i];             // là où se trouve la valeur i
            int v = a[i];
            a[i] = i;
            a[j] = v;
            pos[i] = i;
            pos[v] = j;
            echanges++;
        }
    }
    cout << echanges << "\n";
    return 0;
}
