#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> cpt(21, 0);   // cpt[v] = nombre de copies notées v
    for (int i = 0; i < n; i++) {
        int v;
        cin >> v;
        cpt[v]++;
    }
    bool premier = true;
    for (int v = 0; v <= 20; v++) {   // les valeurs dans l'ordre croissant
        for (int k = 0; k < cpt[v]; k++) {
            if (!premier) cout << " ";
            cout << v;
            premier = false;
        }
    }
    cout << "\n";
    return 0;
}
